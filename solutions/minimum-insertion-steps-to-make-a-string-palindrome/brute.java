class Solution {
    public int minInsertions(String s) {
        return ins(s, 0, s.length() - 1);
    }

    private int ins(String s, int i, int j) {
        if (i >= j) return 0;
        if (s.charAt(i) == s.charAt(j)) return ins(s, i + 1, j - 1);   // ends already mirror
        return 1 + Math.min(ins(s, i + 1, j), ins(s, i, j - 1));       // mirror one end
    }
}
