class Solution {
    public boolean canPartitionKSubsets(int[] nums, int k) {
        int sum = 0;
        for (int x : nums) sum += x;
        if (sum % k != 0) return false;
        return assign(nums, 0, new int[k], sum / k);
    }

    private boolean assign(int[] a, int i, int[] buckets, int target) {
        if (i == a.length) {
            for (int b : buckets) if (b != target) return false;
            return true;
        }
        for (int j = 0; j < buckets.length; j++) {          // try every bucket
            if (buckets[j] + a[i] > target) continue;
            buckets[j] += a[i];
            if (assign(a, i + 1, buckets, target)) return true;
            buckets[j] -= a[i];
        }
        return false;
    }
}
