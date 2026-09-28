class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int n = text2.length();
        int[] prev = new int[n + 1], cur = new int[n + 1];  // two rows
        for (int i = 1; i <= text1.length(); i++) {
            for (int j = 1; j <= n; j++)
                cur[j] = text1.charAt(i - 1) == text2.charAt(j - 1) ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
            int[] t = prev; prev = cur; cur = t;
        }
        return prev[n];
    }
}
