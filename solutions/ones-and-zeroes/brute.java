class Solution {
    public int findMaxForm(String[] strs, int m, int n) {
        return best(strs, 0, m, n);
    }

    private int best(String[] s, int i, int z, int o) {
        if (i == s.length) return 0;
        int zs = 0, os = 0;
        for (char c : s[i].toCharArray()) { if (c == '0') zs++; else os++; }
        int res = best(s, i + 1, z, o);                     // skip
        if (zs <= z && os <= o) res = Math.max(res, 1 + best(s, i + 1, z - zs, o - os));   // take
        return res;
    }
}
