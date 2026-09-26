class Solution {
    public String simplifyPath(String path) {
        List<String> parts = new ArrayList<>(Arrays.asList(path.split("/")));
        boolean changed = true;
        while (changed) {                                   // rewrite until nothing changes
            changed = parts.removeIf(p -> p.isEmpty() || p.equals("."));
            for (int i = 0; i < parts.size(); i++)
                if (parts.get(i).equals("..")) {
                    parts.remove(i);
                    if (i > 0) parts.remove(i - 1);
                    changed = true;
                    break;
                }
        }
        return "/" + String.join("/", parts);
    }
}
