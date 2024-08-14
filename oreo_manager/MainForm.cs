using System;
using System.Diagnostics;
using System.IO;
using System.Text;
using System.Text.Json;
using System.Windows.Forms;
using static OreobotManager.Utils;


namespace OreobotManager
{
    public partial class MainForm : Form
    {
        private Process botProcess;
        private Timer sessionTimer;
        private DateTime sessionStartTime;
        private readonly string runScript;
        private readonly string setupScript;
        private readonly Boolean installed;
        private readonly JsonDocument packageJson;
        

        public MainForm()
        {
            // Get all relevant info
            string projectDirectory = Directory.GetParent(AppDomain.CurrentDomain.BaseDirectory).Parent.Parent.FullName;
            runScript = Path.Combine(projectDirectory, "../scripts/run.bat");
            setupScript = Path.Combine(projectDirectory, "../scripts/setup.bat");
            installed = Directory.Exists(Path.Combine(projectDirectory, "../oreo_app/node_modules"));


            // Setup components
            InitializeComponent();
            BtnSetup.Text = installed ? "Update" : "Install";

            // Load in package.json and write info
            string packageJsonPath = Path.Combine(projectDirectory, "../oreo_app/package.json");
            if (File.Exists(packageJsonPath))
            {
                string jsonContent = File.ReadAllText(packageJsonPath);
                packageJson = JsonDocument.Parse(jsonContent);
                InitializeInfoBoxes();
            }
            else
            {
                ShowErrorDialogue("Could not load in package.json!");
            }
        }

        private void InitializeInfoBoxes()
        {
            using (packageJson)
            {

                // Extract name, version and description
                TxtBotInfo.Text = "";
                if (packageJson.RootElement.TryGetProperty("name", out JsonElement nameElement))
                {
                    AppendBoldText(TxtBotInfo, "Name: ");
                    AppendText(TxtBotInfo, $"{nameElement.GetString()}\n");
                }
                if (packageJson.RootElement.TryGetProperty("version", out JsonElement versionElement))
                {
                    AppendBoldText(TxtBotInfo, "Version: ");
                    AppendText(TxtBotInfo, $"{versionElement.GetString()}\n");
                }
                if (packageJson.RootElement.TryGetProperty("description", out JsonElement descElement))
                {
                    AppendBoldText(TxtBotInfo, "Description:\n");
                    AppendText(TxtBotInfo, $"    {descElement.GetString()}\n");
                }

                // Put in default values for session info
                TxtSessionInfo.Text = "";
                TxtSessionInfo.Text = "";
                AppendBoldText(TxtSessionInfo, "Status: ");
                AppendText(TxtSessionInfo, "Not started. Press the start button to initialise new session.\n");
                AppendBoldText(TxtSessionInfo, "Start time:\n\n");
                AppendBoldText(TxtSessionInfo, "Uptime:");

                // Extract supported distube plugin dependencies
                TxtSupportedInfo.Text = "";
                if (packageJson.RootElement.TryGetProperty("dependencies", out JsonElement dependenciesElement))
                {
                    AppendBoldText(TxtSupportedInfo, "Supported DisTube Plugins: \n");
                    foreach (JsonProperty dependency in dependenciesElement.EnumerateObject())
                    {
                        if (dependency.Name.StartsWith("@distube/"))
                        {
                            string depName = dependency.Name.Substring("@distube/".Length);
                            AppendText(TxtSupportedInfo, $" - {depName}\n");
                        }
                    }
                }
            }
        }

        private void SessionTimerUpdate()
        {
            // Get time elapsed
            TimeSpan elapsed = DateTime.Now - sessionStartTime;
            double totalSeconds = elapsed.TotalSeconds;

            // Get the index of the first character of the last line
            int lastLineIndex = TxtSessionInfo.GetFirstCharIndexFromLine(TxtSessionInfo.Lines.Length - 1);
            int lineLength = TxtSessionInfo.Lines[TxtSessionInfo.Lines.Length - 1].Length;
            int endIndex = lastLineIndex + lineLength;

            // Select the last line
            TxtSessionInfo.Select(lastLineIndex, endIndex - lastLineIndex);
            TxtSessionInfo.SelectedText = GetFormattedTime((int)Math.Round(totalSeconds));
        }

        private void UpdateSessionStatus(Boolean running, string status)
        {
            if (running) {

                // Start timer
                sessionTimer = new Timer() { Interval = 5000 };
                sessionTimer.Tick += (sender, e) => SessionTimerUpdate();
                sessionTimer.Start();
                sessionStartTime = DateTime.Now;

                // Set session status
                TxtSessionInfo.Text = "";
                AppendBoldText(TxtSessionInfo, "Status: ");
                AppendText(TxtSessionInfo, status + "\n");
                AppendBoldText(TxtSessionInfo, "Start time:\n");
                AppendText(TxtSessionInfo, $"{DateTime.Now}\n");
                AppendBoldText(TxtSessionInfo, "Uptime:\n");
                AppendText(TxtSessionInfo, "00:00:00:00");
            }
            else
            {
                // Stop timer
                sessionTimer.Stop();
                sessionTimer.Dispose();

                // Change status text
                int startIndex = 8;
                int endIndex = TxtSessionInfo.Lines[0].Length;

                // Select the last line
                TxtSessionInfo.Select(startIndex, endIndex - startIndex + 1);
                TxtSessionInfo.SelectedText = status;

                // One last tick for uptime
                SessionTimerUpdate();
            }
        }

        private void ShowErrorDialogue(string message)
        {
            ErrorDialogueForm errorDialog = new ErrorDialogueForm(message);
            errorDialog.ShowDialog();
        }

        private void BtnStart_Click(object sender, EventArgs e)
        {
            if (botProcess == null || botProcess.HasExited)
            {
                
                // Start new session of oreo
                TxtLogs.Clear();
                TxtLogs.Focus();
                botProcess = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = runScript,
                        StandardOutputEncoding = Encoding.UTF8,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        UseShellExecute = false,
                        CreateNoWindow = true
                    }
                };
                botProcess.OutputDataReceived += (s, ev) => AppendText(TxtLogs, ev.Data + "\n");
                botProcess.ErrorDataReceived += (s, ev) => AppendText(TxtLogs, ev.Data + "\n");
                botProcess.Start();
                botProcess.BeginOutputReadLine();
                botProcess.BeginErrorReadLine();

                // Disable/Enable buttons
                BtnSetup.Enabled = false;
                BtnStart.Enabled = false;
                BtnStop.Enabled = true;
                BtnRestart.Enabled = true;

                // Update Status and start timer
                UpdateSessionStatus(true, "Running...\n");
            }
        }

        private void BtnStop_Click(object sender, EventArgs e)
        {
            if (botProcess != null && !botProcess.HasExited)
            {

                // Stop oreo session
                botProcess.Kill();
                botProcess = null;

                // Disable/Enable buttons
                BtnSetup.Enabled = true;
                BtnStart.Enabled = true;
                BtnStop.Enabled = false;
                BtnRestart.Enabled = false;

                // Update Status and stop timer
                UpdateSessionStatus(false, "Stopped.\n");
            }
        }

        private void BtnRestart_Click(object sender, EventArgs e)
        {
            TxtLogs.Text = "";
            BtnStop_Click(sender, e);
            BtnStart_Click(sender, e);
        }

        private void BtnSetup_Click(object sender, EventArgs e)
        {
            // Disable all buttons
            BtnSetup.Enabled = false;
            BtnStart.Enabled = false;
            BtnStop.Enabled = false;
            BtnRestart.Enabled = false;

            // Run installer
            TxtLogs.Clear();
            TxtLogs.Focus();

            Process setupProcess = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = setupScript,
                    StandardOutputEncoding = Encoding.UTF8,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                },
                EnableRaisingEvents = true
            };
            setupProcess.OutputDataReceived += (s, ev) => AppendText(TxtLogs, ev.Data + "\n");
            setupProcess.ErrorDataReceived += (s, ev) => AppendText(TxtLogs, ev.Data + "\n");

            // Use exit event handler to control button availability
            setupProcess.Exited += (s, ev) =>
            {
                Invoke((Action)(() =>
                {
                    BtnSetup.Text = "Update";
                    BtnSetup.Enabled = true;
                    BtnStart.Enabled = true;
                    BtnStop.Enabled = false;
                    BtnRestart.Enabled = false;
                }));
            };

            setupProcess.Start();
            setupProcess.BeginOutputReadLine();
            setupProcess.BeginErrorReadLine();
        }

        private void MouseLeaveClearTooltip(object sender, EventArgs e)
        {
            TxtTooltip.Clear();
        }

        private void BtnStart_MouseEnter(object sender, EventArgs e)
        {
            AppendText(TxtTooltip, "Starts new process (will clear logs if any).");
        }

        private void BtnStop_MouseEnter(object sender, EventArgs e)
        {
            AppendText(TxtTooltip, "Stops the current process.");
        }

        private void BtnRestart_MouseEnter(object sender, EventArgs e)
        {
            AppendText(TxtTooltip, "Stops the process then starts a new one.");
        }

        private void BtnSetup_MouseEnter(object sender, EventArgs e)
        {
            AppendText(TxtTooltip, "Update/Install dependencies for Oreo.");
        }

        private void TxtBotInfo_MouseEnter(object sender, EventArgs e)
        {
            AppendText(TxtTooltip, "Information about Oreo.");
        }

        private void TxtLogs_MouseEnter(object sender, EventArgs e)
        {
            AppendText(TxtTooltip, "Logs produced by Oreo.");
        }
    }
}
