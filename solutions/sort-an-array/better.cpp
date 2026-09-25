class Solution {
    mt19937 rng{7};
    void quickSort(vector<int>& a, int lo, int hi) {
        if (lo >= hi) return;
        int pivot = a[lo + rng() % (hi - lo + 1)];
        int lt = lo, i = lo, gt = hi;          // a[lo..lt-1] < pivot, a[gt+1..hi] > pivot
        while (i <= gt) {
            if (a[i] < pivot) swap(a[lt++], a[i++]);
            else if (a[i] > pivot) swap(a[i], a[gt--]);
            else i++;
        }
        quickSort(a, lo, lt - 1);
        quickSort(a, gt + 1, hi);
    }
public:
    vector<int> sortArray(vector<int>& nums) {
        quickSort(nums, 0, (int)nums.size() - 1);
        return nums;
    }
};
