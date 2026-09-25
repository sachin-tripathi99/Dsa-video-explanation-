class Solution {
public:
    ListNode* deleteDuplicates(ListNode* head) {
        unordered_set<int> seen;
        ListNode dummy;
        ListNode* tail = &dummy;
        for (ListNode* c = head; c; c = c->next) {
            if (seen.insert(c->val).second) { tail->next = new ListNode(c->val); tail = tail->next; }
        }
        return dummy.next;
    }
};
