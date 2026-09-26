class Solution {
public:
    vector<int> findClosestElements(vector<int>& arr, int k, int x) {
        vector<int> all = arr;
        sort(all.begin(), all.end(), [x](int a, int b) { return abs(a - x) != abs(b - x) ? abs(a - x) < abs(b - x) : a < b; });
        vector<int> out(all.begin(), all.begin() + k);
        sort(out.begin(), out.end());
        return out;
    }
};
