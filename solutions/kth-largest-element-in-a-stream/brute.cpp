class KthLargest {
    int k;
    vector<int> all;
public:
    KthLargest(int k, vector<int>& nums) : k(k), all(nums) {}
    int add(int val) {
        all.push_back(val);
        sort(all.begin(), all.end());
        return all[all.size() - k];
    }
};
