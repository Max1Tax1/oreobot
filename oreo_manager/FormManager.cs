namespace OreoManager
{
    public static class FormManager
    {
        public static void CloseAllForms()
        {

            // List down and close all forms
            List<Form> formsToClose = Application.OpenForms.Cast<Form>().ToList();
            formsToClose.ForEach(form => form.Close());

            Environment.Exit(0);
        }

    }
}