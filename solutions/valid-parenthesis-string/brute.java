class Solution {
    public boolean checkValidString(String s) {
        return go(s, 0, 0);
    }

    private boolean go(String s, int i, int open) {
        if (open < 0) return false;
        if (i == s.length()) return open == 0;
        char c = s.charAt(i);
        if (c == '(') return go(s, i + 1, open + 1);
        if (c == ')') return go(s, i + 1, open - 1);
        return go(s, i + 1, open + 1) || go(s, i + 1, open - 1) || go(s, i + 1, open);   // * as ( ) or empty
    }
}
