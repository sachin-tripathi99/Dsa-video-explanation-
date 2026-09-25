class Solution {
    private String build(String s) {
        StringBuilder sb = new StringBuilder();          // used as a stack
        for (char c : s.toCharArray()) {
            if (c == '#') { if (sb.length() > 0) sb.deleteCharAt(sb.length() - 1); }
            else sb.append(c);
        }
        return sb.toString();
    }

    public boolean backspaceCompare(String s, String t) {
        return build(s).equals(build(t));
    }
}
