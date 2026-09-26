class Solution {
public:
    int pairSum(ListNode* head) {
        vector<int> vals;
        for (ListNode* p = head; p; p = p->next) vals.push_back(p->val);
        int n = vals.size(), best = 0;
        for (int i = 0; i < n / 2; i++) best = max(best, vals[i] + vals[n - 1 - i]);
        return best;
    }
};
