class Solution {
    public int longestValidParentheses(String s) {
        int best = 0, open = 0, close = 0;
        for (int i = 0; i < s.length(); i++) {           // left to right
            if (s.charAt(i) == '(') open++; else close++;
            if (open == close) best = Math.max(best, 2 * close);
            else if (close > open) open = close = 0;
        }
        open = close = 0;
        for (int i = s.length() - 1; i >= 0; i--) {      // right to left
            if (s.charAt(i) == '(') open++; else close++;
            if (open == close) best = Math.max(best, 2 * open);
            else if (open > close) open = close = 0;
        }
        return best;
    }
}
