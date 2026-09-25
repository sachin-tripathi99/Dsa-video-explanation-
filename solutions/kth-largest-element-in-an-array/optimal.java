class Solution {
    private final Random rng = new Random(1);

    public int findKthLargest(int[] nums, int k) {
        int target = nums.length - k, lo = 0, hi = nums.length - 1;
        while (true) {
            int pivot = nums[lo + rng.nextInt(hi - lo + 1)];
            int lt = lo, i = lo, gt = hi;                         // three-way partition
            while (i <= gt) {
                if (nums[i] < pivot) swap(nums, lt++, i++);
                else if (nums[i] > pivot) swap(nums, i, gt--);
                else i++;
            }
            if (target < lt) hi = lt - 1;                         // answer is on the left
            else if (target > gt) lo = gt + 1;                    // answer is on the right
            else return pivot;                                    // target is among the pivots
        }
    }

    private void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
}
