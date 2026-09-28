class Solution {
    public int minDistance(String word1, String word2) {
        return del(word1, word2, word1.length(), word2.length());
    }

    private int del(String x, String y, int i, int j) {
        if (i == 0) return j;
        if (j == 0) return i;
        if (x.charAt(i - 1) == y.charAt(j - 1)) return del(x, y, i - 1, j - 1);   // keep both
        return 1 + Math.min(del(x, y, i - 1, j), del(x, y, i, j - 1));           // delete one
    }
}
