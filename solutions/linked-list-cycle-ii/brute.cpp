class Solution {
public:
    ListNode* detectCycle(ListNode* head) {
        unordered_set<ListNode*> seen;
        for (ListNode* p = head; p; p = p->next)
            if (!seen.insert(p).second) return p;
        return nullptr;
    }
};
