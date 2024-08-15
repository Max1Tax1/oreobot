namespace OreobotManager
{
    partial class ErrorDialogueForm
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
            BtnErrorOk = new Button();
            ImgError = new PictureBox();
            TxtError = new RichTextBox();
            ((System.ComponentModel.ISupportInitialize)ImgError).BeginInit();
            SuspendLayout();
            // 
            // BtnErrorOk
            // 
            BtnErrorOk.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            BtnErrorOk.Location = new Point(316, 103);
            BtnErrorOk.MaximumSize = new Size(100, 34);
            BtnErrorOk.MinimumSize = new Size(100, 34);
            BtnErrorOk.Name = "BtnErrorOk";
            BtnErrorOk.Size = new Size(100, 34);
            BtnErrorOk.TabIndex = 1;
            BtnErrorOk.Text = "Ok";
            BtnErrorOk.UseVisualStyleBackColor = true;
            BtnErrorOk.Click += BtnErrorOk_Click;
            // 
            // ImgError
            // 
            ImgError.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            ImgError.ErrorImage = null;
            ImgError.Image = OreoManager.Properties.Resources.error;
            ImgError.InitialImage = null;
            ImgError.Location = new Point(6, 26);
            ImgError.MaximumSize = new Size(60, 60);
            ImgError.MinimumSize = new Size(60, 60);
            ImgError.Name = "ImgError";
            ImgError.Size = new Size(60, 60);
            ImgError.SizeMode = PictureBoxSizeMode.StretchImage;
            ImgError.TabIndex = 2;
            ImgError.TabStop = false;
            // 
            // TxtError
            // 
            TxtError.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            TxtError.BackColor = SystemColors.Menu;
            TxtError.BorderStyle = BorderStyle.None;
            TxtError.Enabled = false;
            TxtError.Font = new Font("Consolas", 9F, FontStyle.Regular, GraphicsUnit.Point, 0);
            TxtError.Location = new Point(72, 45);
            TxtError.MaximumSize = new Size(342, 41);
            TxtError.MaxLength = 40;
            TxtError.MinimumSize = new Size(342, 41);
            TxtError.Multiline = false;
            TxtError.Name = "TxtError";
            TxtError.ReadOnly = true;
            TxtError.ScrollBars = RichTextBoxScrollBars.None;
            TxtError.Size = new Size(342, 41);
            TxtError.TabIndex = 3;
            TxtError.Text = "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO";
            // 
            // ErrorDialogueForm
            // 
            AutoScaleDimensions = new SizeF(120F, 120F);
            AutoScaleMode = AutoScaleMode.Dpi;
            ClientSize = new Size(422, 143);
            ControlBox = false;
            Controls.Add(TxtError);
            Controls.Add(ImgError);
            Controls.Add(BtnErrorOk);
            MaximumSize = new Size(440, 190);
            MinimumSize = new Size(440, 190);
            Name = "ErrorDialogueForm";
            Padding = new Padding(3);
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Fatal Error";
            ((System.ComponentModel.ISupportInitialize)ImgError).EndInit();
            ResumeLayout(false);
        }

        #endregion
        private System.Windows.Forms.Button BtnErrorOk;
        private System.Windows.Forms.PictureBox ImgError;
        private System.Windows.Forms.RichTextBox TxtError;
    }
}