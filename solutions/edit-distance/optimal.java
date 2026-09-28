class Solution {
    public int minDistance(String word1, String word2) {
        int n = word2.length();
        int[] prev = new int[n + 1], cur = new int[n + 1];
        for (int j = 0; j <= n; j++) prev[j] = j;           // from "" : j inserts
        for (int i = 1; i <= word1.length(); i++) {
            cur[0] = i;                                     // to "" : i deletes
            for (int j = 1; j <= n; j++)
                cur[j] = word1.charAt(i - 1) == word2.charAt(j - 1) ? prev[j - 1]
                        : 1 + Math.min(prev[j - 1], Math.min(prev[j], cur[j - 1]));
            int[] t = prev; prev = cur; cur = t;
        }
        return prev[n];
    }
}
