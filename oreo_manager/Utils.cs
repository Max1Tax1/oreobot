namespace OreobotManager
{
    public static class Utils
    {
        private static void HandleTextboxAppend(Control control, string text, Action<RichTextBox, string> appendAction)
        {
            if (control.InvokeRequired)
            {
                control.Invoke(new Action<Control, string, Action<RichTextBox, string>>(HandleTextboxAppend), control, text, appendAction);
            }
            else
            {
                if (text != null)
                {
                    
                    // Simple text box, just append text
                    if (control is TextBox textBox)
                    {
                        textBox.AppendText(text + Environment.NewLine);
                    }
                    
                    // Rich text box, apply action
                    else if (control is RichTextBox richTextBox)
                    {
                        appendAction(richTextBox, text);
                    }
                }
            }
        }

        private static void NormalAppend(RichTextBox richTextBox, string text)
        {
            richTextBox.AppendText(text);
        }

        private static void BoldAppend(RichTextBox richTextBox, string text)
        {
            richTextBox.SelectionFont = new Font(richTextBox.Font, FontStyle.Bold);
            richTextBox.AppendText(text);
            richTextBox.SelectionFont = new Font(richTextBox.Font, FontStyle.Regular);
        }

        public static void AppendText(Control control, string text)
        {
            HandleTextboxAppend(control, text, NormalAppend);
        }

        public static void AppendBoldText(Control control, string text)
        {
            HandleTextboxAppend(control, text, BoldAppend);
        }

        public static string GetFormattedTime(int totalSeconds)
        {
            // Calculate days, hours, minutes, and seconds
            int days = totalSeconds / (24 * 3600);
            totalSeconds %= (24 * 3600);

            int hours = totalSeconds / 3600;
            totalSeconds %= 3600;

            int minutes = totalSeconds / 60;
            int seconds = totalSeconds % 60;

            // Format the result as DD:HH:MM:SS
            return $"{days:D2}:{hours:D2}:{minutes:D2}:{seconds:D2}";
        }
    }
}
