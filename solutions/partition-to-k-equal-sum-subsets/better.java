class Solution {
    public boolean canPartitionKSubsets(int[] nums, int k) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % k != 0) return false;
        Arrays.sort(nums);                                  // place big numbers first
        for (int i = 0, j = nums.length - 1; i < j; i++, j--) { int t = nums[i]; nums[i] = nums[j]; nums[j] = t; }
        if (nums[0] > sum / k) return false;
        return assign(nums, 0, new int[k], sum / k);
    }

    private boolean assign(int[] a, int i, int[] buckets, int target) {
        if (i == a.length) return true;
        for (int j = 0; j < buckets.length; j++) {
            if (buckets[j] + a[i] > target) continue;
            boolean seen = false;                           // skip buckets with an equal sum
            for (int q = 0; q < j && !seen; q++) seen = buckets[q] == buckets[j];
            if (seen) continue;
            buckets[j] += a[i];
            if (assign(a, i + 1, buckets, target)) return true;
            buckets[j] -= a[i];
        }
        return false;
    }
}
