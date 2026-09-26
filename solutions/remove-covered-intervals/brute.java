class Solution {
    public int removeCoveredIntervals(int[][] intervals) {
        int n = intervals.length, kept = 0;
        for (int i = 0; i < n; i++) {
            boolean covered = false;
            for (int j = 0; j < n && !covered; j++)
                if (i != j && intervals[j][0] <= intervals[i][0] && intervals[i][1] <= intervals[j][1]) covered = true;
            if (!covered) kept++;
        }
        return kept;
    }
}
