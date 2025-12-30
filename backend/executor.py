import nbformat
from nbclient import NotebookClient
import os
import datetime
import uuid

class NotebookExecutor:
    def __init__(self, output_dir, notebook_dir):
        self.output_dir = output_dir
        self.notebook_dir = notebook_dir
        os.makedirs(output_dir, exist_ok=True)
        os.makedirs(notebook_dir, exist_ok=True)

    def execute_code(self, code, query=""):
        """
        Executes the provided code string in a Jupyter Notebook.
        Returns a dictionary with paths to outputs and the notebook itself.
        """
        run_id = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        chart_filename = f"chart_{run_id}.png"
        csv_filename = f"data_{run_id}.csv"
        
        # Inject variable definitions for the dynamic filenames
        preamble = f"""
code_output_chart = "{chart_filename}"
code_output_csv = "{csv_filename}"
"""
        full_code = preamble + code

        # Create a new notebook
        nb = nbformat.v4.new_notebook()
        nb.cells.append(nbformat.v4.new_code_cell(full_code))
        
        # Configure execution
        # We set cwd to output_dir so generated files land there
        client = NotebookClient(nb, timeout=600, kernel_name='python3', resources={'metadata': {'path': self.output_dir}})
        
        # Execute
        try:
            client.execute()
        except Exception as e:
            # Even if it fails, we want to see what happened
            print(f"Notebook execution failed: {e}")
            raise e

        # Extract Text Output (Stdout)
        text_output = ""
        for cell in nb.cells:
            if 'outputs' in cell:
                for output in cell['outputs']:
                    if output.output_type == 'stream' and output.name == 'stdout':
                        text_output += output.text
                    elif output.output_type == 'error':
                        text_output += f"\nERROR: {output.evalue}\n"

        # Save the executed notebook
        notebook_filename = f"analysis_{run_id}.ipynb"
        notebook_path = os.path.join(self.notebook_dir, notebook_filename)
        with open(notebook_path, 'w', encoding='utf-8') as f:
            nbformat.write(nb, f)

        # Output paths (relative to backend for serving, or absolute?)
        # Since we serve 'backend/static' at '/static', we want to return '/static/chart_XXX.png'
        
        result = {
            "text_output": text_output,
            "image_path": None,
            "csv_path": None,
            "notebook_path": notebook_path
        }

        # Check if files were created
        abs_chart_path = os.path.join(self.output_dir, chart_filename)
        if os.path.exists(abs_chart_path):
            result["image_path"] = f"/static/{chart_filename}"
        
        abs_csv_path = os.path.join(self.output_dir, csv_filename)
        if os.path.exists(abs_csv_path):
            result["csv_path"] = f"/static/{csv_filename}"

        return result
