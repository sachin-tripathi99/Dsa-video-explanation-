class Solution {
    private final Random rng = new Random(7);

    public int[] sortArray(int[] nums) {
        quickSort(nums, 0, nums.length - 1);
        return nums;
    }

    private void quickSort(int[] a, int lo, int hi) {
        if (lo >= hi) return;
        int pivot = a[lo + rng.nextInt(hi - lo + 1)];
        int lt = lo, i = lo, gt = hi;          // a[lo..lt-1] < pivot, a[gt+1..hi] > pivot
        while (i <= gt) {
            if (a[i] < pivot) swap(a, lt++, i++);
            else if (a[i] > pivot) swap(a, i, gt--);
            else i++;
        }
        quickSort(a, lo, lt - 1);
        quickSort(a, gt + 1, hi);
    }

    private void swap(int[] a, int i, int j) { int t = a[i]; a[i] = a[j]; a[j] = t; }
}
