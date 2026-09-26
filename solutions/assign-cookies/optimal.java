class Solution {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        Arrays.sort(s);
        int i = 0;                                          // least greedy waiting child
        for (int j = 0; j < s.length && i < g.length; j++)
            if (s[j] >= g[i]) i++;                          // cookie j satisfies child i
        return i;
    }
}
