class Solution {
    public int numDistinct(String s, String t) {
        return ways(s, t, 0, 0);
    }

    private int ways(String s, String t, int i, int j) {
        if (j == t.length()) return 1;                      // all of t matched
        if (i == s.length()) return 0;
        int res = ways(s, t, i + 1, j);                     // skip s[i]
        if (s.charAt(i) == t.charAt(j)) res += ways(s, t, i + 1, j + 1);   // use it
        return res;
    }
}
