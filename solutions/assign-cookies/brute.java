class Solution {
    public int findContentChildren(int[] g, int[] s) {
        Arrays.sort(g);
        boolean[] used = new boolean[s.length];
        int content = 0;
        for (int greed : g) {
            int best = -1;
            for (int j = 0; j < s.length; j++)              // smallest unused cookie that fits
                if (!used[j] && s[j] >= greed && (best == -1 || s[j] < s[best])) best = j;
            if (best != -1) { used[best] = true; content++; }
        }
        return content;
    }
}
