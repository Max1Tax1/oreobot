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
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(ErrorDialogueForm));
            this.BtnErrorOk = new System.Windows.Forms.Button();
            this.ImgError = new System.Windows.Forms.PictureBox();
            this.TxtError = new System.Windows.Forms.RichTextBox();
            ((System.ComponentModel.ISupportInitialize)(this.ImgError)).BeginInit();
            this.SuspendLayout();
            // 
            // BtnErrorOk
            // 
            this.BtnErrorOk.Anchor = ((System.Windows.Forms.AnchorStyles)((System.Windows.Forms.AnchorStyles.Bottom | System.Windows.Forms.AnchorStyles.Right)));
            this.BtnErrorOk.Location = new System.Drawing.Point(314, 103);
            this.BtnErrorOk.MaximumSize = new System.Drawing.Size(100, 34);
            this.BtnErrorOk.MinimumSize = new System.Drawing.Size(100, 34);
            this.BtnErrorOk.Name = "BtnErrorOk";
            this.BtnErrorOk.Size = new System.Drawing.Size(100, 34);
            this.BtnErrorOk.TabIndex = 1;
            this.BtnErrorOk.Text = "Ok";
            this.BtnErrorOk.UseVisualStyleBackColor = true;
            this.BtnErrorOk.Click += new System.EventHandler(this.BtnErrorOk_Click);
            // 
            // ImgError
            // 
            this.ImgError.Anchor = System.Windows.Forms.AnchorStyles.Left;
            this.ImgError.Image = ((System.Drawing.Image)(resources.GetObject("ImgError.Image")));
            this.ImgError.Location = new System.Drawing.Point(6, 26);
            this.ImgError.MaximumSize = new System.Drawing.Size(60, 60);
            this.ImgError.MinimumSize = new System.Drawing.Size(60, 60);
            this.ImgError.Name = "ImgError";
            this.ImgError.Size = new System.Drawing.Size(60, 60);
            this.ImgError.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.ImgError.TabIndex = 2;
            this.ImgError.TabStop = false;
            // 
            // TxtError
            // 
            this.TxtError.BackColor = System.Drawing.SystemColors.Menu;
            this.TxtError.BorderStyle = System.Windows.Forms.BorderStyle.None;
            this.TxtError.Cursor = System.Windows.Forms.Cursors.Arrow;
            this.TxtError.Enabled = false;
            this.TxtError.Font = new System.Drawing.Font("Consolas", 9F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.TxtError.Location = new System.Drawing.Point(72, 45);
            this.TxtError.MaximumSize = new System.Drawing.Size(342, 41);
            this.TxtError.MaxLength = 40;
            this.TxtError.MinimumSize = new System.Drawing.Size(342, 41);
            this.TxtError.Multiline = false;
            this.TxtError.Name = "TxtError";
            this.TxtError.ReadOnly = true;
            this.TxtError.ScrollBars = System.Windows.Forms.RichTextBoxScrollBars.None;
            this.TxtError.Size = new System.Drawing.Size(342, 41);
            this.TxtError.TabIndex = 3;
            this.TxtError.Text = "OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO";
            // 
            // ErrorDialogueForm
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(120F, 120F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Dpi;
            this.ClientSize = new System.Drawing.Size(422, 143);
            this.ControlBox = false;
            this.Controls.Add(this.TxtError);
            this.Controls.Add(this.ImgError);
            this.Controls.Add(this.BtnErrorOk);
            this.MaximumSize = new System.Drawing.Size(440, 190);
            this.MinimumSize = new System.Drawing.Size(440, 190);
            this.Name = "ErrorDialogueForm";
            this.Padding = new System.Windows.Forms.Padding(3);
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Fatal Error";
            ((System.ComponentModel.ISupportInitialize)(this.ImgError)).EndInit();
            this.ResumeLayout(false);

        }

        #endregion
        private System.Windows.Forms.Button BtnErrorOk;
        private System.Windows.Forms.PictureBox ImgError;
        private System.Windows.Forms.RichTextBox TxtError;
    }
}