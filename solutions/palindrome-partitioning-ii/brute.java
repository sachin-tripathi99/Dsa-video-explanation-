class Solution {
    public int minCut(String s) {
        return cuts(s, 0);
    }

    private int cuts(String s, int i) {                     // fewest cuts for s[i:]
        if (isPal(s, i, s.length() - 1)) return 0;
        int best = Integer.MAX_VALUE;
        for (int j = i; j < s.length() - 1; j++)
            if (isPal(s, i, j)) best = Math.min(best, 1 + cuts(s, j + 1));   // first piece s[i..j]
        return best;
    }

    private boolean isPal(String s, int l, int r) {
        while (l < r) if (s.charAt(l++) != s.charAt(r--)) return false;
        return true;
    }
}
