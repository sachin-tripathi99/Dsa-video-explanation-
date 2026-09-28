class Solution {
    public int minCut(String s) {
        int n = s.length();
        boolean[][] pal = new boolean[n][n];
        for (int i = n - 1; i >= 0; i--)                    // range table
            for (int j = i; j < n; j++)
                pal[i][j] = s.charAt(i) == s.charAt(j) && (j - i < 2 || pal[i + 1][j - 1]);
        int[] cuts = new int[n];                            // cuts[j]: fewest cuts for s[0..j]
        for (int j = 0; j < n; j++) {
            if (pal[0][j]) continue;                        // whole prefix: 0 cuts
            cuts[j] = j;
            for (int i = 1; i <= j; i++)
                if (pal[i][j]) cuts[j] = Math.min(cuts[j], cuts[i - 1] + 1);   // last piece s[i..j]
        }
        return cuts[n - 1];
    }
}
