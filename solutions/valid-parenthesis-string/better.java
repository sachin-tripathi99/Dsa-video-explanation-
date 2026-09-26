class Solution {
    private Boolean[][] memo;

    public boolean checkValidString(String s) {
        memo = new Boolean[s.length() + 1][s.length() + 1];
        return go(s, 0, 0);
    }

    private boolean go(String s, int i, int open) {
        if (open < 0 || open > s.length() - i) return false;   // cannot close that many
        if (i == s.length()) return open == 0;
        if (memo[i][open] != null) return memo[i][open];
        char c = s.charAt(i);
        boolean r;
        if (c == '(') r = go(s, i + 1, open + 1);
        else if (c == ')') r = go(s, i + 1, open - 1);
        else r = go(s, i + 1, open + 1) || go(s, i + 1, open - 1) || go(s, i + 1, open);
        return memo[i][open] = r;
    }
}
