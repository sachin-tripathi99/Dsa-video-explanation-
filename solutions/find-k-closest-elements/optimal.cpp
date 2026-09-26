class Solution {
public:
    vector<int> findClosestElements(vector<int>& arr, int k, int x) {
        int lo = 0, hi = arr.size() - k;                    // window start in [0, n − k]
        while (lo < hi) {
            int m = (lo + hi) / 2;
            if (x - arr[m] > arr[m + k] - x) lo = m + 1;   // a[m] is farther: move right
            else hi = m;
        }
        return vector<int>(arr.begin() + lo, arr.begin() + lo + k);
    }
};
