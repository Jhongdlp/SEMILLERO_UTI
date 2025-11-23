import re

# Read the file
with open('/home/jhon/.gemini/antigravity/playground/cobalt-lunar/frontend/src/components/ProjectForm.jsx', 'r') as f:
    content = f.read()

# Add darkMode prop to Card components (avoiding duplicates)
content = re.sub(r'<Card className=', r'<Card darkMode={darkMode} className=', content)
content = re.sub(r'<Card\s*>', r'<Card darkMode={darkMode}>', content)

# Add darkMode prop to CardHeader (avoiding duplicates)
content = re.sub(r'<CardHeader\s+(title=)', r'<CardHeader darkMode={darkMode} \1', content)

# Add darkMode prop to Input (direct usage, not in templates)
content = re.sub(r'<Input\s+(label|value|placeholder)=', r'<Input darkMode={darkMode} \1=', content)

# Add darkMode prop to TabButton
content = re.sub(r'<TabButton\s+(active=)', r'<TabButton darkMode={darkMode} \1', content)

# Add darkMode prop to DynamicTable
content = re.sub(r'<DynamicTable\s*\n', r'<DynamicTable darkMode={darkMode}\n', content)
content = re.sub(r'<DynamicTable\s+(columns=)', r'<DynamicTable darkMode={darkMode} \1', content)

# Add darkMode prop to specific buttons
content = re.sub(r'<Button onClick={addProduct}', r'<Button darkMode={darkMode} onClick={addProduct}', content)
content = re.sub(r'<Button onClick={handleSubmit}', r'<Button darkMode={darkMode} onClick={handleSubmit}', content)

# Clean up any double darkMode props that might have been added
content = re.sub(r'darkMode={darkMode}\s+darkMode={darkMode}', r'darkMode={darkMode}', content)

# Write back
with open('/home/jhon/.gemini/antigravity/playground/cobalt-lunar/frontend/src/components/ProjectForm.jsx', 'w') as f:
    f.write(content)

print("Dark mode props added successfully!")
