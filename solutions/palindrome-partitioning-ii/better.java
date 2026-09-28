class Solution {
    private int[] memo;

    public int minCut(String s) {
        memo = new int[s.length()];
        Arrays.fill(memo, -1);
        return cuts(s, 0);
    }

    private int cuts(String s, int i) {
        if (isPal(s, i, s.length() - 1)) return 0;
        if (memo[i] >= 0) return memo[i];                   // solved before
        int best = Integer.MAX_VALUE;
        for (int j = i; j < s.length() - 1; j++)
            if (isPal(s, i, j)) best = Math.min(best, 1 + cuts(s, j + 1));
        return memo[i] = best;
    }

    private boolean isPal(String s, int l, int r) {
        while (l < r) if (s.charAt(l++) != s.charAt(r--)) return false;
        return true;
    }
}
