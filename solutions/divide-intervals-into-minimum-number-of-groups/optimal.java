class Solution {
    public int minGroups(int[][] intervals) {
        int n = intervals.length;
        int[] st = new int[n], en = new int[n];
        for (int i = 0; i < n; i++) { st[i] = intervals[i][0]; en[i] = intervals[i][1]; }
        Arrays.sort(st);
        Arrays.sort(en);
        int j = 0, groups = 0;
        for (int s : st) {
            if (s > en[j]) j++;                         // an interval finished: reuse its group
            else groups++;
        }
        return groups;
    }
}
