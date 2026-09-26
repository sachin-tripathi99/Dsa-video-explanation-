class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> cnt;
        for (int x : nums) cnt[x]++;
        vector<vector<int>> bucket(nums.size() + 1);
        for (auto& [key, c] : cnt) bucket[c].push_back(key);   // bucket[count]
        vector<int> out;
        for (int c = nums.size(); c >= 1 && (int)out.size() < k; c--)
            for (int key : bucket[c]) if ((int)out.size() < k) out.push_back(key);
        return out;
    }
};
