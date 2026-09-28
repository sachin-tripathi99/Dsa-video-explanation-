class Solution {
    public String longestPalindrome(String s) {
        int n = s.length(), bi = 0, bj = 0;
        boolean[][] pal = new boolean[n][n];
        for (int len = 1; len <= n; len++)                  // short ranges first
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                pal[i][j] = s.charAt(i) == s.charAt(j) && (len <= 2 || pal[i + 1][j - 1]);
                if (pal[i][j] && len > bj - bi + 1) { bi = i; bj = j; }
            }
        return s.substring(bi, bj + 1);
    }
}
