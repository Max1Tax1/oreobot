using OreoManager;
using System;
using System.Windows.Forms;

namespace OreobotManager
{
    public partial class ErrorDialogueForm : Form
    {
        public ErrorDialogueForm(string message)
        {
            InitializeComponent();
            TxtError.Text = message;
        }

        private void BtnErrorOk_Click(object sender, EventArgs e)
        {
            FormManager.CloseAllForms();
        }
    }
}
