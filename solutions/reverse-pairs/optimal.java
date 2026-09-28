class Solution {
    public int reversePairs(int[] nums) {
        long[] vals = Arrays.stream(nums).asLongStream().distinct().sorted().toArray();   // rank = index + 1
        int[] tree = new int[vals.length + 1];
        int count = 0;
        for (int j = 0; j < nums.length; j++) {
            int k = upper(vals, 2L * nums[j]);                  // number of vals ≤ 2 · nums[j]
            int below = 0;
            for (int x = k; x > 0; x -= x & -x) below += tree[x];
            count += j - below;                                 // earlier values above 2 · nums[j]
            for (int x = upper(vals, nums[j]); x < tree.length; x += x & -x) tree[x]++;
        }
        return count;
    }

    private int upper(long[] a, long x) {                       // count of a[i] ≤ x
        int lo = 0, hi = a.length;
        while (lo < hi) {
            int mid = (lo + hi) >>> 1;
            if (a[mid] <= x) lo = mid + 1; else hi = mid;
        }
        return lo;
    }
}
