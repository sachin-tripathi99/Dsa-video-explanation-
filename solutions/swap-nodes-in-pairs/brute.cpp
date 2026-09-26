class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        vector<ListNode*> nodes;
        for (ListNode* p = head; p; p = p->next) nodes.push_back(p);
        for (size_t i = 0; i + 1 < nodes.size(); i += 2) swap(nodes[i], nodes[i + 1]);
        ListNode dummy(0);
        ListNode* p = &dummy;
        for (ListNode* x : nodes) { p->next = x; p = x; }
        p->next = nullptr;
        return dummy.next;
    }
};
