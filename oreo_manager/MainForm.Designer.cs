namespace OreobotManager
{
    partial class MainForm
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MainForm));
            this.BtnStart = new System.Windows.Forms.Button();
            this.BtnStop = new System.Windows.Forms.Button();
            this.BtnRestart = new System.Windows.Forms.Button();
            this.TxtLogs = new System.Windows.Forms.RichTextBox();
            this.TxtBotInfo = new System.Windows.Forms.RichTextBox();
            this.TxtTooltip = new System.Windows.Forms.RichTextBox();
            this.TxtSessionInfo = new System.Windows.Forms.RichTextBox();
            this.TxtSupportedInfo = new System.Windows.Forms.RichTextBox();
            this.BtnSetup = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // BtnStart
            // 
            this.BtnStart.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.BtnStart.Location = new System.Drawing.Point(654, 205);
            this.BtnStart.Name = "BtnStart";
            this.BtnStart.Size = new System.Drawing.Size(75, 45);
            this.BtnStart.TabIndex = 0;
            this.BtnStart.Text = "Start";
            this.BtnStart.UseVisualStyleBackColor = true;
            this.BtnStart.Click += new System.EventHandler(this.BtnStart_Click);
            this.BtnStart.MouseEnter += new System.EventHandler(this.BtnStart_MouseEnter);
            this.BtnStart.MouseLeave += new System.EventHandler(this.MouseLeaveClearTooltip);
            // 
            // BtnStop
            // 
            this.BtnStop.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.BtnStop.Enabled = false;
            this.BtnStop.Location = new System.Drawing.Point(654, 256);
            this.BtnStop.Name = "BtnStop";
            this.BtnStop.Size = new System.Drawing.Size(75, 45);
            this.BtnStop.TabIndex = 1;
            this.BtnStop.Text = "Stop";
            this.BtnStop.UseVisualStyleBackColor = true;
            this.BtnStop.Click += new System.EventHandler(this.BtnStop_Click);
            this.BtnStop.MouseEnter += new System.EventHandler(this.BtnStop_MouseEnter);
            this.BtnStop.MouseLeave += new System.EventHandler(this.MouseLeaveClearTooltip);
            // 
            // BtnRestart
            // 
            this.BtnRestart.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.BtnRestart.Enabled = false;
            this.BtnRestart.Location = new System.Drawing.Point(654, 307);
            this.BtnRestart.Name = "BtnRestart";
            this.BtnRestart.Size = new System.Drawing.Size(75, 45);
            this.BtnRestart.TabIndex = 2;
            this.BtnRestart.Text = "Restart";
            this.BtnRestart.UseVisualStyleBackColor = true;
            this.BtnRestart.Click += new System.EventHandler(this.BtnRestart_Click);
            this.BtnRestart.MouseEnter += new System.EventHandler(this.BtnRestart_MouseEnter);
            this.BtnRestart.MouseLeave += new System.EventHandler(this.MouseLeaveClearTooltip);
            // 
            // TxtLogs
            // 
            this.TxtLogs.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.TxtLogs.BackColor = System.Drawing.Color.Black;
            this.TxtLogs.CausesValidation = false;
            this.TxtLogs.Cursor = System.Windows.Forms.Cursors.IBeam;
            this.TxtLogs.Font = new System.Drawing.Font("Consolas", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.TxtLogs.ForeColor = System.Drawing.Color.White;
            this.TxtLogs.Location = new System.Drawing.Point(9, 154);
            this.TxtLogs.Margin = new System.Windows.Forms.Padding(0);
            this.TxtLogs.Name = "TxtLogs";
            this.TxtLogs.ReadOnly = true;
            this.TxtLogs.ScrollBars = System.Windows.Forms.RichTextBoxScrollBars.ForcedBoth;
            this.TxtLogs.Size = new System.Drawing.Size(642, 475);
            this.TxtLogs.TabIndex = 6;
            this.TxtLogs.TabStop = false;
            this.TxtLogs.Text = "";
            this.TxtLogs.MouseEnter += new System.EventHandler(this.TxtLogs_MouseEnter);
            this.TxtLogs.MouseLeave += new System.EventHandler(this.MouseLeaveClearTooltip);
            // 
            // TxtBotInfo
            // 
            this.TxtBotInfo.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.TxtBotInfo.Font = new System.Drawing.Font("Consolas", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.TxtBotInfo.Location = new System.Drawing.Point(9, 4);
            this.TxtBotInfo.Margin = new System.Windows.Forms.Padding(0);
            this.TxtBotInfo.Name = "TxtBotInfo";
            this.TxtBotInfo.ReadOnly = true;
            this.TxtBotInfo.ScrollBars = System.Windows.Forms.RichTextBoxScrollBars.None;
            this.TxtBotInfo.Size = new System.Drawing.Size(240, 144);
            this.TxtBotInfo.TabIndex = 7;
            this.TxtBotInfo.TabStop = false;
            this.TxtBotInfo.Text = "";
            this.TxtBotInfo.MouseEnter += new System.EventHandler(this.TxtBotInfo_MouseEnter);
            this.TxtBotInfo.MouseLeave += new System.EventHandler(this.MouseLeaveClearTooltip);
            // 
            // TxtTooltip
            // 
            this.TxtTooltip.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.TxtTooltip.BackColor = System.Drawing.SystemColors.Menu;
            this.TxtTooltip.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.TxtTooltip.Cursor = System.Windows.Forms.Cursors.Arrow;
            this.TxtTooltip.Enabled = false;
            this.TxtTooltip.Font = new System.Drawing.Font("Microsoft Sans Serif", 7.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.TxtTooltip.Location = new System.Drawing.Point(9, 642);
            this.TxtTooltip.Margin = new System.Windows.Forms.Padding(0);
            this.TxtTooltip.Name = "TxtTooltip";
            this.TxtTooltip.ReadOnly = true;
            this.TxtTooltip.ScrollBars = System.Windows.Forms.RichTextBoxScrollBars.None;
            this.TxtTooltip.Size = new System.Drawing.Size(720, 24);
            this.TxtTooltip.TabIndex = 8;
            this.TxtTooltip.Text = "";
            // 
            // TxtSessionInfo
            // 
            this.TxtSessionInfo.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.TxtSessionInfo.Font = new System.Drawing.Font("Consolas", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.TxtSessionInfo.Location = new System.Drawing.Point(249, 4);
            this.TxtSessionInfo.Margin = new System.Windows.Forms.Padding(0);
            this.TxtSessionInfo.Name = "TxtSessionInfo";
            this.TxtSessionInfo.ReadOnly = true;
            this.TxtSessionInfo.ScrollBars = System.Windows.Forms.RichTextBoxScrollBars.None;
            this.TxtSessionInfo.Size = new System.Drawing.Size(240, 144);
            this.TxtSessionInfo.TabIndex = 9;
            this.TxtSessionInfo.TabStop = false;
            this.TxtSessionInfo.Text = "";
            // 
            // TxtSupportedInfo
            // 
            this.TxtSupportedInfo.Anchor = ((System.Windows.Forms.AnchorStyles)(((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.TxtSupportedInfo.Font = new System.Drawing.Font("Consolas", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.TxtSupportedInfo.Location = new System.Drawing.Point(489, 4);
            this.TxtSupportedInfo.Margin = new System.Windows.Forms.Padding(0);
            this.TxtSupportedInfo.Name = "TxtSupportedInfo";
            this.TxtSupportedInfo.ReadOnly = true;
            this.TxtSupportedInfo.ScrollBars = System.Windows.Forms.RichTextBoxScrollBars.None;
            this.TxtSupportedInfo.Size = new System.Drawing.Size(240, 144);
            this.TxtSupportedInfo.TabIndex = 10;
            this.TxtSupportedInfo.TabStop = false;
            this.TxtSupportedInfo.Text = "";
            // 
            // BtnSetup
            // 
            this.BtnSetup.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Right)));
            this.BtnSetup.Location = new System.Drawing.Point(654, 154);
            this.BtnSetup.Name = "BtnSetup";
            this.BtnSetup.Size = new System.Drawing.Size(75, 45);
            this.BtnSetup.TabIndex = 11;
            this.BtnSetup.Text = "Install";
            this.BtnSetup.UseVisualStyleBackColor = true;
            this.BtnSetup.Click += new System.EventHandler(this.BtnSetup_Click);
            this.BtnSetup.MouseEnter += new System.EventHandler(this.BtnSetup_MouseEnter);
            this.BtnSetup.MouseLeave += new System.EventHandler(this.MouseLeaveClearTooltip);
            // 
            // MainForm
            // 
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.None;
            this.AutoSizeMode = System.Windows.Forms.AutoSizeMode.GrowAndShrink;
            this.BackColor = System.Drawing.SystemColors.ButtonFace;
            this.ClientSize = new System.Drawing.Size(738, 665);
            this.Controls.Add(this.BtnSetup);
            this.Controls.Add(this.TxtSupportedInfo);
            this.Controls.Add(this.TxtSessionInfo);
            this.Controls.Add(this.TxtTooltip);
            this.Controls.Add(this.TxtBotInfo);
            this.Controls.Add(this.TxtLogs);
            this.Controls.Add(this.BtnRestart);
            this.Controls.Add(this.BtnStop);
            this.Controls.Add(this.BtnStart);
            this.DoubleBuffered = true;
            this.Font = new System.Drawing.Font("Consolas", 7.8F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Icon = ((System.Drawing.Icon)(resources.GetObject("$this.Icon")));
            this.MaximumSize = new System.Drawing.Size(756, 9999);
            this.MinimumSize = new System.Drawing.Size(756, 665);
            this.Name = "MainForm";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Oreo Manager";
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button BtnStart;
        private System.Windows.Forms.Button BtnStop;
        private System.Windows.Forms.Button BtnRestart;
        private System.Windows.Forms.RichTextBox TxtLogs;
        private System.Windows.Forms.RichTextBox TxtBotInfo;
        private System.Windows.Forms.RichTextBox TxtTooltip;
        private System.Windows.Forms.RichTextBox TxtSessionInfo;
        private System.Windows.Forms.RichTextBox TxtSupportedInfo;
        private System.Windows.Forms.Button BtnSetup;
    }
}

