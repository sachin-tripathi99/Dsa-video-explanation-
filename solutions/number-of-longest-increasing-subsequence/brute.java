class Solution {
    private int bestLen = 0, bestCnt = 0;

    public int findNumberOfLIS(int[] nums) {
        walk(nums, 0, Long.MIN_VALUE, 0);
        return bestCnt;
    }

    private void walk(int[] a, int i, long prev, int len) {  // every increasing subsequence
        if (i == a.length) {
            if (len > bestLen) { bestLen = len; bestCnt = 1; }
            else if (len == bestLen) bestCnt++;
            return;
        }
        if (a[i] > prev) walk(a, i + 1, a[i], len + 1);     // take
        walk(a, i + 1, prev, len);                          // skip
    }
}
