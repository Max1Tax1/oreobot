using System;
using System.Collections.Generic;
using System.Windows.Forms;

public static class FormManager
{
    public static void CloseAllForms()
    {

        // Create a list of all the open forms
        List<Form> formsToClose = new List<Form>();
        foreach (Form form in Application.OpenForms)
        {
            formsToClose.Add(form);
        }

        // Close each form from the list
        foreach (Form form in formsToClose)
        {
            form.Close();
        }

        Environment.Exit(0);
    }

}