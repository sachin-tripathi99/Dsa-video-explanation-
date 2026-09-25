class Solution {
public:
    ListNode* removeElements(ListNode* head, int val) {
        ListNode dummy;
        ListNode* tail = &dummy;
        for (ListNode* c = head; c; c = c->next) {
            if (c->val != val) { tail->next = new ListNode(c->val); tail = tail->next; }
        }
        return dummy.next;
    }
};
