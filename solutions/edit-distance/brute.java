class Solution {
    public int minDistance(String word1, String word2) {
        return ed(word1, word2, word1.length(), word2.length());
    }

    private int ed(String x, String y, int i, int j) {
        if (i == 0) return j;                               // insert the rest
        if (j == 0) return i;                               // delete the rest
        if (x.charAt(i - 1) == y.charAt(j - 1)) return ed(x, y, i - 1, j - 1);
        return 1 + Math.min(ed(x, y, i - 1, j - 1), Math.min(ed(x, y, i - 1, j), ed(x, y, i, j - 1)));
    }
}
