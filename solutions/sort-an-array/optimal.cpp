class Solution {
    void mergeSort(vector<int>& a, int lo, int hi, vector<int>& tmp) {
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
public:
    vector<int> sortArray(vector<int>& nums) {
        vector<int> tmp(nums.size());           // one buffer, reused by every merge
        mergeSort(nums, 0, (int)nums.size() - 1, tmp);
        return nums;
    }
};
