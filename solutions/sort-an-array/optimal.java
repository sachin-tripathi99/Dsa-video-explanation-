class Solution {
    public int[] sortArray(int[] nums) {
        int[] tmp = new int[nums.length];           // one buffer, reused by every merge
        mergeSort(nums, 0, nums.length - 1, tmp);
        return nums;
    }

    private void mergeSort(int[] a, int lo, int hi, int[] tmp) {
        if (lo >= hi) return;
        int mid = lo + (hi - lo) / 2;
        mergeSort(a, lo, mid, tmp);
        mergeSort(a, mid + 1, hi, tmp);
        int i = lo, j = mid + 1, k = lo;
        while (i <= mid && j <= hi) tmp[k++] = a[i] <= a[j] ? a[i++] : a[j++];
        while (i <= mid) tmp[k++] = a[i++];
        while (j <= hi) tmp[k++] = a[j++];
        for (k = lo; k <= hi; k++) a[k] = tmp[k];
    }
}
