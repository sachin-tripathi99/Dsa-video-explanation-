class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[] prev = new int[n + 1], cur = new int[n + 1];  // LCS rows
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++)
                cur[j] = word1.charAt(i - 1) == word2.charAt(j - 1) ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
            int[] t = prev; prev = cur; cur = t;
        }
        return m + n - 2 * prev[n];                         // delete everything outside the LCS
    }
}
