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
            BtnStart = new Button();
            BtnStop = new Button();
            BtnRestart = new Button();
            TxtLogs = new RichTextBox();
            TxtBotInfo = new RichTextBox();
            TxtTooltip = new RichTextBox();
            TxtSessionInfo = new RichTextBox();
            TxtSupportedInfo = new RichTextBox();
            BtnSetup = new Button();
            SuspendLayout();
            // 
            // BtnStart
            // 
            BtnStart.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            BtnStart.Location = new Point(654, 205);
            BtnStart.Name = "BtnStart";
            BtnStart.Size = new Size(75, 45);
            BtnStart.TabIndex = 0;
            BtnStart.Text = "Start";
            BtnStart.UseVisualStyleBackColor = true;
            BtnStart.Click += BtnStart_Click;
            BtnStart.MouseEnter += BtnStart_MouseEnter;
            BtnStart.MouseLeave += MouseLeaveClearTooltip;
            // 
            // BtnStop
            // 
            BtnStop.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            BtnStop.Enabled = false;
            BtnStop.Location = new Point(654, 256);
            BtnStop.Name = "BtnStop";
            BtnStop.Size = new Size(75, 45);
            BtnStop.TabIndex = 1;
            BtnStop.Text = "Stop";
            BtnStop.UseVisualStyleBackColor = true;
            BtnStop.Click += BtnStop_Click;
            BtnStop.MouseEnter += BtnStop_MouseEnter;
            BtnStop.MouseLeave += MouseLeaveClearTooltip;
            // 
            // BtnRestart
            // 
            BtnRestart.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            BtnRestart.Enabled = false;
            BtnRestart.Location = new Point(654, 307);
            BtnRestart.Name = "BtnRestart";
            BtnRestart.Size = new Size(75, 45);
            BtnRestart.TabIndex = 2;
            BtnRestart.Text = "Restart";
            BtnRestart.UseVisualStyleBackColor = true;
            BtnRestart.Click += BtnRestart_Click;
            BtnRestart.MouseEnter += BtnRestart_MouseEnter;
            BtnRestart.MouseLeave += MouseLeaveClearTooltip;
            // 
            // TxtLogs
            // 
            TxtLogs.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            TxtLogs.BackColor = Color.Black;
            TxtLogs.CausesValidation = false;
            TxtLogs.Cursor = Cursors.IBeam;
            TxtLogs.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            TxtLogs.ForeColor = Color.White;
            TxtLogs.Location = new Point(9, 154);
            TxtLogs.Margin = new Padding(0);
            TxtLogs.Name = "TxtLogs";
            TxtLogs.ReadOnly = true;
            TxtLogs.ScrollBars = RichTextBoxScrollBars.ForcedBoth;
            TxtLogs.Size = new Size(642, 475);
            TxtLogs.TabIndex = 6;
            TxtLogs.TabStop = false;
            TxtLogs.Text = "";
            TxtLogs.MouseEnter += TxtLogs_MouseEnter;
            TxtLogs.MouseLeave += MouseLeaveClearTooltip;
            // 
            // TxtBotInfo
            // 
            TxtBotInfo.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            TxtBotInfo.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            TxtBotInfo.Location = new Point(9, 4);
            TxtBotInfo.Margin = new Padding(0);
            TxtBotInfo.Name = "TxtBotInfo";
            TxtBotInfo.ReadOnly = true;
            TxtBotInfo.ScrollBars = RichTextBoxScrollBars.None;
            TxtBotInfo.Size = new Size(240, 144);
            TxtBotInfo.TabIndex = 7;
            TxtBotInfo.TabStop = false;
            TxtBotInfo.Text = "";
            TxtBotInfo.MouseEnter += TxtBotInfo_MouseEnter;
            TxtBotInfo.MouseLeave += MouseLeaveClearTooltip;
            // 
            // TxtTooltip
            // 
            TxtTooltip.Anchor = AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            TxtTooltip.BackColor = SystemColors.Menu;
            TxtTooltip.BorderStyle = BorderStyle.None;
            TxtTooltip.Enabled = false;
            TxtTooltip.Font = new Font("Microsoft Sans Serif", 7.8F, FontStyle.Regular, GraphicsUnit.Point, 0);
            TxtTooltip.Location = new Point(9, 642);
            TxtTooltip.Margin = new Padding(0);
            TxtTooltip.Name = "TxtTooltip";
            TxtTooltip.ReadOnly = true;
            TxtTooltip.ScrollBars = RichTextBoxScrollBars.None;
            TxtTooltip.Size = new Size(720, 24);
            TxtTooltip.TabIndex = 8;
            TxtTooltip.Text = "";
            // 
            // TxtSessionInfo
            // 
            TxtSessionInfo.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            TxtSessionInfo.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            TxtSessionInfo.Location = new Point(249, 4);
            TxtSessionInfo.Margin = new Padding(0);
            TxtSessionInfo.Name = "TxtSessionInfo";
            TxtSessionInfo.ReadOnly = true;
            TxtSessionInfo.ScrollBars = RichTextBoxScrollBars.None;
            TxtSessionInfo.Size = new Size(240, 144);
            TxtSessionInfo.TabIndex = 9;
            TxtSessionInfo.TabStop = false;
            TxtSessionInfo.Text = "";
            // 
            // TxtSupportedInfo
            // 
            TxtSupportedInfo.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            TxtSupportedInfo.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            TxtSupportedInfo.Location = new Point(489, 4);
            TxtSupportedInfo.Margin = new Padding(0);
            TxtSupportedInfo.Name = "TxtSupportedInfo";
            TxtSupportedInfo.ReadOnly = true;
            TxtSupportedInfo.ScrollBars = RichTextBoxScrollBars.None;
            TxtSupportedInfo.Size = new Size(240, 144);
            TxtSupportedInfo.TabIndex = 10;
            TxtSupportedInfo.TabStop = false;
            TxtSupportedInfo.Text = "";
            // 
            // BtnSetup
            // 
            BtnSetup.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            BtnSetup.Location = new Point(654, 154);
            BtnSetup.Name = "BtnSetup";
            BtnSetup.Size = new Size(75, 45);
            BtnSetup.TabIndex = 11;
            BtnSetup.Text = "Install";
            BtnSetup.UseVisualStyleBackColor = true;
            BtnSetup.Click += BtnSetup_Click;
            BtnSetup.MouseEnter += BtnSetup_MouseEnter;
            BtnSetup.MouseLeave += MouseLeaveClearTooltip;
            // 
            // MainForm
            // 
            AutoScaleMode = AutoScaleMode.None;
            AutoSizeMode = AutoSizeMode.GrowAndShrink;
            BackColor = SystemColors.ButtonFace;
            ClientSize = new Size(738, 665);
            Controls.Add(BtnSetup);
            Controls.Add(TxtSupportedInfo);
            Controls.Add(TxtSessionInfo);
            Controls.Add(TxtTooltip);
            Controls.Add(TxtBotInfo);
            Controls.Add(TxtLogs);
            Controls.Add(BtnRestart);
            Controls.Add(BtnStop);
            Controls.Add(BtnStart);
            DoubleBuffered = true;
            Font = new Font("Consolas", 7.8F, FontStyle.Regular, GraphicsUnit.Point, 0);
            Icon = (Icon)resources.GetObject("$this.Icon");
            MaximumSize = new Size(756, 9999);
            MinimumSize = new Size(756, 665);
            Name = "MainForm";
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Oreo Manager";
            ResumeLayout(false);
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

