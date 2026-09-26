class Solution {
    private final List<String> out = new ArrayList<>();

    public List<String> generateParenthesis(int n) {
        go(n, new StringBuilder(), 0, 0);
        return out;
    }

    private void go(int n, StringBuilder s, int open, int close) {
        if (s.length() == 2 * n) { out.add(s.toString()); return; }
        if (open < n) { s.append('('); go(n, s, open + 1, close); s.deleteCharAt(s.length() - 1); }
        if (close < open) { s.append(')'); go(n, s, open, close + 1); s.deleteCharAt(s.length() - 1); }
    }
}
