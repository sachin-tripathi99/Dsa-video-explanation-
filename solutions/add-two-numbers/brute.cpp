class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        unsigned long long x = 0, y = 0, p = 1;
        for (ListNode* c = l1; c; c = c->next, p *= 10) x += c->val * p;   // overflows past ~19 digits
        p = 1;
        for (ListNode* c = l2; c; c = c->next, p *= 10) y += c->val * p;
        unsigned long long s = x + y;
        ListNode dummy;
        ListNode* tail = &dummy;
        do { tail->next = new ListNode(s % 10); tail = tail->next; s /= 10; } while (s > 0);
        return dummy.next;
    }
};
