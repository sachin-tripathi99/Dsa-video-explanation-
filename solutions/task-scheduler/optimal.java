class Solution {
    public int leastInterval(char[] tasks, int n) {
        int[] cnt = new int[26];
        for (char t : tasks) cnt[t - 'A']++;
        int maxF = 0, cntMax = 0;
        for (int c : cnt) maxF = Math.max(maxF, c);
        for (int c : cnt) if (c == maxF) cntMax++;
        return Math.max(tasks.length, (maxF - 1) * (n + 1) + cntMax);
    }
}
