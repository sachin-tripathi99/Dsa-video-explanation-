class Solution {
    public String simplifyPath(String path) {
        Deque<String> st = new ArrayDeque<>();
        for (String part : path.split("/")) {
            if (part.isEmpty() || part.equals(".")) continue;
            if (part.equals("..")) { if (!st.isEmpty()) st.pollLast(); }
            else st.addLast(part);
        }
        return "/" + String.join("/", st);
    }
}
